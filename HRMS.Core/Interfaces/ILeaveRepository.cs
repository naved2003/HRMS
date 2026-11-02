using HRMS.Core.Entities;

namespace HRMS.Core.Interfaces;

public interface ILeaveRepository : IRepository<LeaveRequest>
{
    Task<IEnumerable<LeaveRequest>> GetByEmployeeAsync(int employeeId);
    Task<IEnumerable<LeaveRequest>> GetPendingRequestsAsync();
    Task<LeaveRequest?> GetLeaveWithDetailsAsync(int id);
}
