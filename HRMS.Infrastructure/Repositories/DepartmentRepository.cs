using HRMS.Core.Entities;
using HRMS.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HRMS.Infrastructure.Repositories;

public class DepartmentRepository : Repository<Department>, IDepartmentRepository
{
    public DepartmentRepository(HRMSDbContext context) : base(context) { }

    public async Task<IEnumerable<Department>> GetActiveDepartmentsAsync()
    {
        return await Context.Departments
            .Where(d => d.ManagerId != null)
            .OrderBy(d => d.Name)
            .ToListAsync();
    }

    public async Task<Department?> GetDepartmentWithManagerAsync(int id)
    {
        return await Context.Departments
            .Include(d => d.Manager)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<bool> IsCodeUniqueAsync(string code)
    {
        return !await Context.Departments.AnyAsync(d => d.Code == code);
    }

    public async Task<bool> IsCodeUniqueForIdAsync(int id, string code)
    {
        return !await Context.Departments.AnyAsync(d => d.Code == code && d.Id != id);
    }
}
