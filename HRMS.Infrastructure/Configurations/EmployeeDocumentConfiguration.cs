using HRMS.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRMS.Infrastructure.Configurations;

public class EmployeeDocumentConfiguration : IEntityTypeConfiguration<EmployeeDocument>
{
    public void Configure(EntityTypeBuilder<EmployeeDocument> builder)
    {
        builder.ToTable("EmployeeDocuments");
        builder.HasKey(d => d.Id);

        builder.Property(d => d.DocumentType).IsRequired().HasMaxLength(50);
        builder.Property(d => d.FileName).IsRequired().HasMaxLength(255);
        builder.Property(d => d.FilePath).IsRequired().HasMaxLength(1000);

        builder.HasOne(d => d.Employee)
               .WithMany()
               .HasForeignKey(d => d.EmployeeId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(d => d.UploadedBy)
               .WithMany()
               .HasForeignKey(d => d.UploadedById)
               .OnDelete(DeleteBehavior.Restrict);

        builder.Property(d => d.UploadedOn).HasColumnType("datetime2");
    }
}
