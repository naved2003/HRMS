namespace HRMS.Core.Entities;

public class PerformanceReview
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string ReviewPeriod { get; set; } = string.Empty;
    public DateTime ReviewDate { get; set; }
    public int Rating { get; set; }
    public string? Goals { get; set; }
    public string? Achievements { get; set; }
    public string? Feedback { get; set; }
    public int ReviewedById { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Employee? Employee { get; set; }
    public Employee? ReviewedBy { get; set; }
}
