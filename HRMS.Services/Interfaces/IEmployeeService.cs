using HRMS.Services.DTOs;

namespace HRMS.Services.Interfaces;

public interface IEmployeeService
{
    Task<IEnumerable<EmployeeListDto>> GetAllAsync();
    Task<IEnumerable<EmployeeListDto>> GetActiveAsync();
    Task<EmployeeDto?> GetByIdAsync(int id);
    Task<EmployeeDto?> GetEmployeeWithDetailsAsync(int id);
    Task<IEnumerable<EmployeeListDto>> GetByDepartmentAsync(int departmentId);
    Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto);
    Task<EmployeeDto?> UpdateAsync(int id, UpdateEmployeeDto dto);
    Task<bool> DeleteAsync(int id);
}
