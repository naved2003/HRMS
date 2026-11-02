namespace HRMS.Core.Entities;

public class LeaveType
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public short DefaultDays { get; set; }
    public bool IsPaid { get; set; } = true;

    public ICollection<LeaveRequest> LeaveRequests { get; set; } = new List<LeaveRequest>();
}
