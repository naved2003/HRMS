namespace HRMS.Core.Entities;

public class EmployeeDocument
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string DocumentType { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public DateTime UploadedOn { get; set; } = DateTime.UtcNow;
    public int UploadedById { get; set; }

    public Employee? Employee { get; set; }
    public ApplicationUser? UploadedBy { get; set; }
}
