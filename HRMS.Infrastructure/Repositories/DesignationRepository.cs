using HRMS.Core.Entities;
using HRMS.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HRMS.Infrastructure.Repositories;

public class DesignationRepository : Repository<Designation>, IDesignationRepository
{
    public DesignationRepository(HRMSDbContext context) : base(context) { }

    public async Task<IEnumerable<Designation>> GetByDepartmentAsync(int departmentId)
    {
        return await Context.Designations
            .Where(d => d.DepartmentId == departmentId)
            .OrderBy(d => d.Title)
            .ToListAsync();
    }
}
