namespace HRMS.Core.Entities;

public class SalaryStructure
{
    public int Id { get; set; }
    public int DesignationId { get; set; }
    public decimal Basic { get; set; }
    public decimal HRA { get; set; }
    public decimal Conveyance { get; set; }
    public decimal Medical { get; set; }
    public decimal Special { get; set; }
    public decimal PF { get; set; }
    public decimal ESI { get; set; }
    public decimal Tax { get; set; }
    public DateTime EffectiveFrom { get; set; } = DateTime.UtcNow;

    public Designation? Designation { get; set; }
}
