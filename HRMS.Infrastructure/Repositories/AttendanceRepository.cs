using HRMS.Core.Entities;
using HRMS.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HRMS.Infrastructure.Repositories;

public class AttendanceRepository : Repository<Attendance>, IAttendanceRepository
{
    public AttendanceRepository(HRMSDbContext context) : base(context) { }

    public async Task<IEnumerable<Attendance>> GetByEmployeeAsync(int employeeId, DateTime? from, DateTime? to)
    {
        var query = Context.Attendance
            .Include(a => a.Employee)
            .Where(a => a.EmployeeId == employeeId);

        if (from.HasValue)
            query = query.Where(a => a.Date >= from.Value);

        if (to.HasValue)
            query = query.Where(a => a.Date <= to.Value);

        return await query.OrderByDescending(a => a.Date).ToListAsync();
    }

    public async Task<Attendance?> GetByEmployeeAndDateAsync(int employeeId, DateTime date)
    {
        return await Context.Attendance
            .Include(a => a.Employee)
            .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.Date == date);
    }

    public async Task<IEnumerable<Attendance>> GetByDateAsync(DateTime date)
    {
        return await Context.Attendance
            .Include(a => a.Employee)
            .ThenInclude(e => e!.Department)
            .Where(a => a.Date == date)
            .OrderBy(a => a.Employee!.FirstName)
            .ToListAsync();
    }
}
