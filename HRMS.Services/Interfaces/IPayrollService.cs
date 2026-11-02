using HRMS.Services.DTOs;

namespace HRMS.Services.Interfaces;

public interface IPayrollService
{
    Task<PayrollRecordDto?> ProcessPayrollAsync(int employeeId, int month, int year, string? remarks = null);
    Task<int> ProcessBulkPayrollAsync(int month, int year);
    Task<PayslipDto?> GetPayslipAsync(int payrollRecordId);
    Task<IEnumerable<PayrollRecordDto>> GetByMonthYearAsync(int month, int year);
    Task<IEnumerable<SalaryStructureDto>> GetSalaryStructuresAsync();
    Task<SalaryStructureDto?> GetSalaryStructureByIdAsync(int id);
    Task<SalaryStructureDto> CreateSalaryStructureAsync(SalaryStructureDto dto);
    Task<SalaryStructureDto?> UpdateSalaryStructureAsync(int id, SalaryStructureDto dto);
}
