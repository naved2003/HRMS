using HRMS.Core.Enums;

namespace HRMS.Core.Entities;

public class PayrollRecord
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal GrossSalary { get; set; }
    public decimal TotalDeductions { get; set; }
    public decimal NetPay { get; set; }
    public DateTime ProcessedOn { get; set; } = DateTime.UtcNow;
    public PayrollStatus Status { get; set; } = PayrollStatus.Draft;
    public string? Remarks { get; set; }

    public Employee? Employee { get; set; }
    public Payslip? Payslip { get; set; }
}
