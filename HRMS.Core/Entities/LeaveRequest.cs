using HRMS.Core.Enums;

namespace HRMS.Core.Entities;

public class LeaveRequest
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public int LeaveTypeId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal NumberOfDays { get; set; }
    public string Reason { get; set; } = string.Empty;
    public LeaveStatus Status { get; set; } = LeaveStatus.Pending;
    public int AppliedById { get; set; }
    public int? ApprovedById { get; set; }
    public string? ApprovalRemarks { get; set; }
    public DateTime AppliedOn { get; set; } = DateTime.UtcNow;
    public DateTime? ApprovedOn { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Employee? Employee { get; set; }
    public LeaveType? LeaveType { get; set; }
    public Employee? AppliedBy { get; set; }
    public Employee? ApprovedBy { get; set; }
}
