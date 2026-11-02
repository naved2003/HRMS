using HRMS.Core.Entities;

namespace HRMS.Core.Interfaces;

public interface IEmployeeRepository : IRepository<Employee>
{
    Task<Employee?> GetEmployeeWithDetailsAsync(int id);
    Task<IEnumerable<Employee>> GetByDepartmentAsync(int departmentId);
    Task<bool> IsEmployeeCodeUniqueAsync(string code);
    Task<IEnumerable<Employee>> GetActiveEmployeesAsync();
}
