using HRMS.Core.Entities;

namespace HRMS.Core.Interfaces;

public interface IAttendanceRepository : IRepository<Attendance>
{
    Task<IEnumerable<Attendance>> GetByEmployeeAsync(int employeeId, DateTime? from, DateTime? to);
    Task<Attendance?> GetByEmployeeAndDateAsync(int employeeId, DateTime date);
    Task<IEnumerable<Attendance>> GetByDateAsync(DateTime date);
}
