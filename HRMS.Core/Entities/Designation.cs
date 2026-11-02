namespace HRMS.Core.Entities;

public class Designation
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public int DepartmentId { get; set; }
    public string? Grade { get; set; }
    public decimal MinSalary { get; set; }
    public decimal MaxSalary { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Department? Department { get; set; }
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    public ICollection<SalaryStructure> SalaryStructures { get; set; } = new List<SalaryStructure>();
}
