using HRMS.Core.Enums;

namespace HRMS.Services.DTOs;

public record LeaveRequestDto
{
    public int Id { get; init; }
    public int EmployeeId { get; init; }
    public string? EmployeeName { get; init; }
    public int LeaveTypeId { get; init; }
    public string? LeaveTypeName { get; init; }
    public DateTime StartDate { get; init; } = DateTime.UtcNow;
    public DateTime EndDate { get; init; } = DateTime.UtcNow;
    public decimal NumberOfDays { get; init; }
    public string Reason { get; init; } = string.Empty;
    public LeaveStatus Status { get; init; }
    public int AppliedById { get; init; }
    public string? AppliedByName { get; init; }
    public int? ApprovedById { get; init; }
    public string? ApprovedByName { get; init; }
    public string? ApprovalRemarks { get; init; }
    public DateTime AppliedOn { get; init; } = DateTime.UtcNow;
    public DateTime? ApprovedOn { get; init; }
}

public record ApplyLeaveDto
{
    public int EmployeeId { get; init; }
    public int LeaveTypeId { get; init; }
    public DateTime StartDate { get; init; } = DateTime.UtcNow;
    public DateTime EndDate { get; init; } = DateTime.UtcNow;
    public string Reason { get; init; } = string.Empty;
    public int AppliedById { get; init; }
}

public record ApproveLeaveDto
{
    public int? ApprovedById { get; init; }
    public string? ApprovalRemarks { get; init; }
}

public record LeaveTypeDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public short DefaultDays { get; init; }
    public bool IsPaid { get; init; }
}
