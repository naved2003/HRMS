using HRMS.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRMS.Infrastructure.Configurations;

public class DepartmentConfiguration : IEntityTypeConfiguration<Department>
{
    public void Configure(EntityTypeBuilder<Department> builder)
    {
        builder.ToTable("Departments");
        builder.HasKey(d => d.Id);

        builder.Property(d => d.Name)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(d => d.Code)
               .IsRequired()
               .HasMaxLength(20);

        builder.HasIndex(d => d.Code).IsUnique();

        builder.Property(d => d.Description).HasMaxLength(500);

        builder.Property(d => d.RowVersion)
               .IsRowVersion();

        builder.HasOne(d => d.Manager)
               .WithMany()
               .HasForeignKey(d => d.ManagerId)
               .IsRequired(false)
               .OnDelete(DeleteBehavior.Restrict);

        builder.Property(d => d.CreatedAt).HasColumnType("datetime2");
        builder.Property(d => d.UpdatedAt).HasColumnType("datetime2");
    }
}
