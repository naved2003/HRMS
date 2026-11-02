using HRMS.Core.Enums;
using HRMS.Services.DTOs;
using HRMS.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HRMS.Services.Services;

public sealed class DashboardService : IDashboardService
{
    private readonly HRMS.Infrastructure.HRMSDbContext _dbContext;
    private readonly ILogger<DashboardService> _logger;

    public DashboardService(HRMS.Infrastructure.HRMSDbContext dbContext, ILogger<DashboardService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task<DashboardStatsDto> GetStatsAsync()
    {
        var today = DateTime.Today;
        var now = DateTime.UtcNow;
        var month = now.Month;
        var year = now.Year;

        var totalEmployees = await _dbContext.Employees.CountAsync(e => e.Status == EmployeeStatus.Active);
        var totalDepartments = await _dbContext.Departments.CountAsync();

        var todaysAttendance = await _dbContext.Attendance
            .Where(a => a.Date == today)
            .ToListAsync();
        var presentToday = todaysAttendance.Count(a => a.Status == AttendanceStatus.Present || a.Status == AttendanceStatus.Late);
        var absentToday = todaysAttendance.Count(a => a.Status == AttendanceStatus.Absent);
        var onLeaveToday = todaysAttendance.Count(a => a.Status == AttendanceStatus.WorkFromHome || a.Status == AttendanceStatus.HalfDay);

        var pendingLeaveRequests = await _dbContext.LeaveRequests.CountAsync(l => l.Status == LeaveStatus.Pending);
        var processedPayrollsThisMonth = await _dbContext.PayrollRecords.CountAsync(p => p.Month == month && p.Year == year);

        var departmentWise = await _dbContext.Departments
            .Select(d => new DepartmentWiseCountDto
            {
                Department = d.Name,
                Count = _dbContext.Employees.Count(e => e.DepartmentId == d.Id && e.Status == EmployeeStatus.Active),
            })
            .ToListAsync();

        // Build 7-day attendance trend (oldest first, today last).
        var sevenDaysAgo = today.AddDays(-6);
        var trendRaw = await _dbContext.Attendance
            .Where(a => a.Date >= sevenDaysAgo && a.Date <= today)
            .GroupBy(a => a.Date)
            .Select(g => new
            {
                Date = g.Key,
                Present = g.Count(a => a.Status == AttendanceStatus.Present || a.Status == AttendanceStatus.Late),
                Absent = g.Count(a => a.Status == AttendanceStatus.Absent),
                OnLeave = g.Count(a => a.Status == AttendanceStatus.WorkFromHome || a.Status == AttendanceStatus.HalfDay),
            })
            .ToDictionaryAsync(x => x.Date);

        var attendanceTrend = new List<AttendanceTrendPointDto>();
        for (var i = 6; i >= 0; i--)
        {
            var date = today.AddDays(-i);
            if (trendRaw.TryGetValue(date, out var point))
            {
                attendanceTrend.Add(new AttendanceTrendPointDto
                {
                    Date = date.ToString("yyyy-MM-dd"),
                    Present = point.Present,
                    Absent = point.Absent,
                    OnLeave = point.OnLeave,
                });
            }
            else
            {
                // No attendance records for this day — include a zero row so the chart
                // still shows the date label.
                attendanceTrend.Add(new AttendanceTrendPointDto
                {
                    Date = date.ToString("yyyy-MM-dd"),
                    Present = 0,
                    Absent = 0,
                    OnLeave = 0,
                });
            }
        }

        // Leave status breakdown for the doughnut chart.
        var leaveStatusCounts = await _dbContext.LeaveRequests
            .GroupBy(l => l.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Status, x => x.Count);

        var leaveBreakdown = new LeaveStatusBreakdownDto
        {
            Pending = leaveStatusCounts.GetValueOrDefault(LeaveStatus.Pending),
            Approved = leaveStatusCounts.GetValueOrDefault(LeaveStatus.Approved),
            Rejected = leaveStatusCounts.GetValueOrDefault(LeaveStatus.Rejected),
            Cancelled = leaveStatusCounts.GetValueOrDefault(LeaveStatus.Cancelled),
        };

        return new DashboardStatsDto
        {
            TotalEmployees = totalEmployees,
            TotalDepartments = totalDepartments,
            PresentToday = presentToday,
            AbsentToday = absentToday,
            OnLeaveToday = onLeaveToday,
            PendingLeaveRequests = pendingLeaveRequests,
            ProcessedPayrollsThisMonth = processedPayrollsThisMonth,
            DepartmentWiseCount = departmentWise,
            AttendanceTrend = attendanceTrend,
            LeaveStatusBreakdown = leaveBreakdown,
        };
    }
}
