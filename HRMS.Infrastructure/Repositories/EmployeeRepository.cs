using HRMS.Core.Entities;
using HRMS.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HRMS.Infrastructure.Repositories;

public class EmployeeRepository : Repository<Employee>, IEmployeeRepository
{
    public EmployeeRepository(HRMSDbContext context) : base(context) { }

    public async Task<Employee?> GetEmployeeWithDetailsAsync(int id)
    {
        return await Context.Employees
            .Include(e => e.Department)
            .Include(e => e.Designation)
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<IEnumerable<Employee>> GetByDepartmentAsync(int departmentId)
    {
        return await Context.Employees
            .Include(e => e.Designation)
            .Where(e => e.DepartmentId == departmentId)
            .OrderBy(e => e.FirstName)
            .ToListAsync();
    }

    public async Task<bool> IsEmployeeCodeUniqueAsync(string code)
    {
        return !await Context.Employees.AnyAsync(e => e.EmployeeCode == code);
    }

    public async Task<IEnumerable<Employee>> GetActiveEmployeesAsync()
    {
        return await Context.Employees
            .Include(e => e.Department)
            .Include(e => e.Designation)
            .Where(e => e.Status == Core.Enums.EmployeeStatus.Active)
            .OrderBy(e => e.FirstName)
            .ToListAsync();
    }
}
