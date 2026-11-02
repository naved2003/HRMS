using AutoMapper;
using HRMS.Core.Entities;
using HRMS.Core.Enums;
using HRMS.Core.Interfaces;
using HRMS.Services.DTOs;
using HRMS.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HRMS.Services.Services;

public sealed class PayrollService : IPayrollService
{
    private readonly IPayrollRepository _repository;
    private readonly HRMS.Infrastructure.HRMSDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly ILogger<PayrollService> _logger;

    public PayrollService(IPayrollRepository repository, HRMS.Infrastructure.HRMSDbContext dbContext, IMapper mapper, ILogger<PayrollService> logger)
    {
        _repository = repository;
        _dbContext = dbContext;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PayrollRecordDto?> ProcessPayrollAsync(int employeeId, int month, int year, string? remarks = null)
    {
        if (month < 1 || month > 12) throw new ArgumentOutOfRangeException(nameof(month));
        if (year < 2000) throw new ArgumentOutOfRangeException(nameof(year));

        var employee = await _dbContext.Employees
            .Include(e => e.Designation)
            .FirstOrDefaultAsync(e => e.Id == employeeId);
        if (employee is null) return null;

        var existing = await _repository.GetByEmployeeAndMonthYearAsync(employeeId, month, year);
        if (existing is not null)
        {
            _logger.LogWarning("Payroll already exists for employee {EmployeeId} on {Month}/{Year}", employeeId, month, year);
            return _mapper.Map<PayrollRecordDto>(existing);
        }

        var salaryStructure = await _dbContext.SalaryStructures
            .Where(s => s.DesignationId == employee.DesignationId && s.EffectiveFrom <= DateTime.UtcNow)
            .OrderByDescending(s => s.EffectiveFrom)
            .FirstOrDefaultAsync();

        decimal basic = salaryStructure?.Basic ?? employee.BasicSalary;
        decimal hra = salaryStructure?.HRA ?? 0;
        decimal conveyance = salaryStructure?.Conveyance ?? 0;
        decimal medical = salaryStructure?.Medical ?? 0;
        decimal special = salaryStructure?.Special ?? 0;
        decimal pf = salaryStructure?.PF ?? 0;
        decimal esi = salaryStructure?.ESI ?? 0;
        decimal tax = salaryStructure?.Tax ?? 0;

        decimal gross = basic + hra + conveyance + medical + special;
        decimal deductions = pf + esi + tax;
        decimal netPay = gross - deductions;

        var record = new PayrollRecord
        {
            EmployeeId = employeeId,
            Month = month,
            Year = year,
            GrossSalary = Math.Round(gross, 2),
            TotalDeductions = Math.Round(deductions, 2),
            NetPay = Math.Round(netPay, 2),
            ProcessedOn = DateTime.UtcNow,
            Status = PayrollStatus.Processed,
            Remarks = remarks
        };
        await _repository.AddAsync(record);

        var payslip = new Payslip
        {
            PayrollRecordId = record.Id,
            EmployeeId = employeeId,
            Basic = basic,
            HRA = hra,
            Conveyance = conveyance,
            Medical = medical,
            SpecialAllowance = special,
            TotalEarnings = Math.Round(gross, 2),
            PF = pf,
            ESI = esi,
            Tax = tax,
            TotalDeductions = Math.Round(deductions, 2),
            NetPay = Math.Round(netPay, 2),
            GeneratedOn = DateTime.UtcNow
        };
        await _dbContext.Payslips.AddAsync(payslip);
        await _dbContext.SaveChangesAsync();

        var refreshed = await _repository.GetByEmployeeAndMonthYearAsync(employeeId, month, year);
        _logger.LogInformation("Payroll processed for employee {EmployeeId} on {Month}/{Year}", employeeId, month, year);
        return refreshed is null ? null : _mapper.Map<PayrollRecordDto>(refreshed);
    }

    public async Task<int> ProcessBulkPayrollAsync(int month, int year)
    {
        var employees = await _dbContext.Employees
            .Where(e => e.Status == EmployeeStatus.Active)
            .ToListAsync();
        var processed = 0;
        foreach (var emp in employees)
        {
            try
            {
                var result = await ProcessPayrollAsync(emp.Id, month, year);
                if (result is not null) processed++;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed processing payroll for employee {EmployeeId}", emp.Id);
            }
        }
        _logger.LogInformation("Bulk payroll processed {Count}/{Total} for {Month}/{Year}", processed, employees.Count, month, year);
        return processed;
    }

    public async Task<PayslipDto?> GetPayslipAsync(int payrollRecordId)
    {
        var payslip = await _dbContext.Payslips
            .Include(p => p.Employee)
            .Include(p => p.PayrollRecord)
            .FirstOrDefaultAsync(p => p.PayrollRecordId == payrollRecordId);
        return payslip is null ? null : _mapper.Map<PayslipDto>(payslip);
    }

    public async Task<IEnumerable<PayrollRecordDto>> GetByMonthYearAsync(int month, int year)
    {
        var records = await _repository.GetByMonthYearAsync(month, year);
        return _mapper.Map<IEnumerable<PayrollRecordDto>>(records);
    }

    public async Task<IEnumerable<SalaryStructureDto>> GetSalaryStructuresAsync()
    {
        var structures = await _dbContext.SalaryStructures
            .Include(s => s.Designation)
            .ToListAsync();
        return _mapper.Map<IEnumerable<SalaryStructureDto>>(structures);
    }

    public async Task<SalaryStructureDto?> GetSalaryStructureByIdAsync(int id)
    {
        var entity = await _dbContext.SalaryStructures
            .Include(s => s.Designation)
            .FirstOrDefaultAsync(s => s.Id == id);
        return entity is null ? null : _mapper.Map<SalaryStructureDto>(entity);
    }

    public async Task<SalaryStructureDto> CreateSalaryStructureAsync(SalaryStructureDto dto)
    {
        var entity = _mapper.Map<SalaryStructure>(dto);
        entity.EffectiveFrom = dto.EffectiveFrom == default ? DateTime.UtcNow : dto.EffectiveFrom;
        await _dbContext.SalaryStructures.AddAsync(entity);
        await _dbContext.SaveChangesAsync();
        return _mapper.Map<SalaryStructureDto>(entity);
    }

    public async Task<SalaryStructureDto?> UpdateSalaryStructureAsync(int id, SalaryStructureDto dto)
    {
        var entity = await _dbContext.SalaryStructures.FirstOrDefaultAsync(s => s.Id == id);
        if (entity is null) return null;
        entity.DesignationId = dto.DesignationId;
        entity.Basic = dto.Basic;
        entity.HRA = dto.HRA;
        entity.Conveyance = dto.Conveyance;
        entity.Medical = dto.Medical;
        entity.Special = dto.Special;
        entity.PF = dto.PF;
        entity.ESI = dto.ESI;
        entity.Tax = dto.Tax;
        entity.EffectiveFrom = dto.EffectiveFrom;
        await _dbContext.SaveChangesAsync();
        return _mapper.Map<SalaryStructureDto>(entity);
    }
}
