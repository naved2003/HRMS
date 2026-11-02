using HRMS.Core.Entities;
using HRMS.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HRMS.Infrastructure.Repositories;

public class LeaveRepository : Repository<LeaveRequest>, ILeaveRepository
{
    public LeaveRepository(HRMSDbContext context) : base(context) { }

    public async Task<IEnumerable<LeaveRequest>> GetByEmployeeAsync(int employeeId)
    {
        return await Context.LeaveRequests
            .Include(l => l.LeaveType)
            .Include(l => l.Employee)
            .Include(l => l.ApprovedBy)
            .Where(l => l.EmployeeId == employeeId)
            .OrderByDescending(l => l.AppliedOn)
            .ToListAsync();
    }

    public async Task<IEnumerable<LeaveRequest>> GetPendingRequestsAsync()
    {
        return await Context.LeaveRequests
            .Include(l => l.LeaveType)
            .Include(l => l.Employee)
            .ThenInclude(e => e!.Department)
            .Include(l => l.AppliedBy)
            .Where(l => l.Status == Core.Enums.LeaveStatus.Pending)
            .OrderBy(l => l.AppliedOn)
            .ToListAsync();
    }

    public async Task<LeaveRequest?> GetLeaveWithDetailsAsync(int id)
    {
        return await Context.LeaveRequests
            .Include(l => l.LeaveType)
            .Include(l => l.Employee)
            .Include(l => l.AppliedBy)
            .Include(l => l.ApprovedBy)
            .FirstOrDefaultAsync(l => l.Id == id);
    }
}
