namespace HRMS.Core.Entities;

public class Payslip
{
    public int Id { get; set; }
    public int PayrollRecordId { get; set; }
    public int EmployeeId { get; set; }
    public decimal Basic { get; set; }
    public decimal HRA { get; set; }
    public decimal Conveyance { get; set; }
    public decimal Medical { get; set; }
    public decimal SpecialAllowance { get; set; }
    public decimal TotalEarnings { get; set; }
    public decimal PF { get; set; }
    public decimal ESI { get; set; }
    public decimal Tax { get; set; }
    public decimal TotalDeductions { get; set; }
    public decimal NetPay { get; set; }
    public DateTime GeneratedOn { get; set; } = DateTime.UtcNow;

    public PayrollRecord? PayrollRecord { get; set; }
    public Employee? Employee { get; set; }
}
