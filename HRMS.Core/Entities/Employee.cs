using HRMS.Core.Enums;

namespace HRMS.Core.Entities;

public class Employee
{
    public int Id { get; set; }
    public string EmployeeCode { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public DateTime HireDate { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public Gender Gender { get; set; }
    public int DepartmentId { get; set; }
    public int DesignationId { get; set; }
    public EmploymentType EmploymentType { get; set; }
    public decimal BasicSalary { get; set; }
    public EmployeeStatus Status { get; set; } = EmployeeStatus.Active;
    public int? UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public Department? Department { get; set; }
    public Designation? Designation { get; set; }
    public ICollection<Attendance> Attendance { get; set; } = new List<Attendance>();
    public ICollection<LeaveRequest> LeaveRequests { get; set; } = new List<LeaveRequest>();
    public ICollection<PayrollRecord> PayrollRecords { get; set; } = new List<PayrollRecord>();
    public ICollection<Payslip> Payslips { get; set; } = new List<Payslip>();
    public ApplicationUser? User { get; set; }
}
