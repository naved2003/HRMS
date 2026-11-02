namespace HRMS.Services.DTOs;

public record DepartmentWiseCountDto
{
    public string Department { get; init; } = string.Empty;
    public int Count { get; init; }
}

public record AttendanceTrendPointDto
{
    /// <summary>ISO date string (yyyy-MM-dd) for the day.</summary>
    public string Date { get; init; } = string.Empty;
    public int Present { get; init; }
    public int Absent { get; init; }
    public int OnLeave { get; init; }
}

public record LeaveStatusBreakdownDto
{
    public int Pending { get; init; }
    public int Approved { get; init; }
    public int Rejected { get; init; }
    public int Cancelled { get; init; }
}

public record DashboardStatsDto
{
    public int TotalEmployees { get; init; }
    public int TotalDepartments { get; init; }
    public int PresentToday { get; init; }
    public int AbsentToday { get; init; }
    public int OnLeaveToday { get; init; }
    public int PendingLeaveRequests { get; init; }
    public int ProcessedPayrollsThisMonth { get; init; }

    /// <summary>Headcount per department — used for the pie chart.</summary>
    public IReadOnlyList<DepartmentWiseCountDto> DepartmentWiseCount { get; init; } = Array.Empty<DepartmentWiseCountDto>();

    /// <summary>Last 7 days of attendance counts — used for the bar chart.</summary>
    public IReadOnlyList<AttendanceTrendPointDto> AttendanceTrend { get; init; } = Array.Empty<AttendanceTrendPointDto>();

    /// <summary>Leave request status distribution — used for the doughnut chart.</summary>
    public LeaveStatusBreakdownDto? LeaveStatusBreakdown { get; init; }
}
