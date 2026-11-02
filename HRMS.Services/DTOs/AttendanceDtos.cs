using HRMS.Core.Enums;

namespace HRMS.Services.DTOs;

public record AttendanceDto
{
    public int Id { get; init; }
    public int EmployeeId { get; init; }
    public string? EmployeeName { get; init; }
    public DateTime Date { get; init; } = DateTime.UtcNow;
    public TimeSpan? CheckIn { get; init; }
    public TimeSpan? CheckOut { get; init; }
    public AttendanceStatus Status { get; init; }
    public decimal? WorkHours { get; init; }
    public string? Remarks { get; init; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}

public record MarkAttendanceDto
{
    public int EmployeeId { get; init; }
    public DateTime Date { get; init; } = DateTime.UtcNow;
    public TimeSpan? CheckIn { get; init; }
    public TimeSpan? CheckOut { get; init; }
    public string? Remarks { get; init; }
}

public record UpdateAttendanceDto
{
    public TimeSpan? CheckIn { get; init; }
    public TimeSpan? CheckOut { get; init; }
    public AttendanceStatus? Status { get; init; }
    public decimal? WorkHours { get; init; }
    public string? Remarks { get; init; }
}

public record AttendanceFilterDto
{
    public int? EmployeeId { get; init; }
    public DateTime? From { get; init; }
    public DateTime? To { get; init; }
    public AttendanceStatus? Status { get; init; }
}
