using AutoMapper;
using HRMS.Core.Entities;
using HRMS.Core.Interfaces;
using HRMS.Services.DTOs;
using HRMS.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace HRMS.Services.Services;

public sealed class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<EmployeeService> _logger;

    public EmployeeService(IEmployeeRepository repository, IMapper mapper, ILogger<EmployeeService> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<IEnumerable<EmployeeListDto>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<EmployeeListDto>>(entities);
    }

    public async Task<IEnumerable<EmployeeListDto>> GetActiveAsync()
    {
        var entities = await _repository.GetActiveEmployeesAsync();
        return _mapper.Map<IEnumerable<EmployeeListDto>>(entities);
    }

    public async Task<EmployeeDto?> GetByIdAsync(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        return entity is null ? null : _mapper.Map<EmployeeDto>(entity);
    }

    public async Task<EmployeeDto?> GetEmployeeWithDetailsAsync(int id)
    {
        var entity = await _repository.GetEmployeeWithDetailsAsync(id);
        return entity is null ? null : _mapper.Map<EmployeeDto>(entity);
    }

    public async Task<IEnumerable<EmployeeListDto>> GetByDepartmentAsync(int departmentId)
    {
        var entities = await _repository.GetByDepartmentAsync(departmentId);
        return _mapper.Map<IEnumerable<EmployeeListDto>>(entities);
    }

    public async Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto)
    {
        if (!await _repository.IsEmployeeCodeUniqueAsync(dto.EmployeeCode))
            throw new InvalidOperationException($"Employee code '{dto.EmployeeCode}' is already in use.");

        var entity = _mapper.Map<Employee>(dto);
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
        await _repository.AddAsync(entity);
        _logger.LogInformation("Employee created with id {Id}", entity.Id);
        return _mapper.Map<EmployeeDto>(entity);
    }

    public async Task<EmployeeDto?> UpdateAsync(int id, UpdateEmployeeDto dto)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing is null) return null;

        existing.EmployeeCode = dto.EmployeeCode;
        existing.FirstName = dto.FirstName;
        existing.LastName = dto.LastName;
        existing.Email = dto.Email;
        existing.PhoneNumber = dto.PhoneNumber;
        existing.Address = dto.Address;
        existing.HireDate = dto.HireDate;
        existing.DateOfBirth = dto.DateOfBirth;
        existing.Gender = dto.Gender;
        existing.DepartmentId = dto.DepartmentId;
        existing.DesignationId = dto.DesignationId;
        existing.EmploymentType = dto.EmploymentType;
        existing.BasicSalary = dto.BasicSalary;
        existing.Status = dto.Status;
        existing.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(existing);
        return _mapper.Map<EmployeeDto>(existing);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing is null) return false;
        await _repository.DeleteAsync(existing);
        return true;
    }
}
