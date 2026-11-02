using HRMS.Core.Enums;
using HRMS.Services.DTOs;

namespace HRMS.Services.Interfaces;

public interface IAttendanceService
{
    Task<AttendanceDto?> MarkAttendanceAsync(MarkAttendanceDto dto);
    Task<AttendanceDto?> UpdateAttendanceAsync(int id, UpdateAttendanceDto dto);
    Task<IEnumerable<AttendanceDto>> GetByEmployeeAsync(int employeeId, DateTime? from, DateTime? to);
    Task<IEnumerable<AttendanceDto>> GetByDateAsync(DateTime date);
    Task<IEnumerable<AttendanceDto>> GetByRangeAsync(DateTime from, DateTime to, AttendanceStatus? status = null);
}
