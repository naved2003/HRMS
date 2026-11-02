using HRMS.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRMS.Infrastructure.Configurations;

public class DesignationConfiguration : IEntityTypeConfiguration<Designation>
{
    public void Configure(EntityTypeBuilder<Designation> builder)
    {
        builder.ToTable("Designations");
        builder.HasKey(d => d.Id);

        builder.Property(d => d.Title)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(d => d.Code)
               .IsRequired()
               .HasMaxLength(20);

        builder.Property(d => d.Grade).HasMaxLength(20);

        builder.Property(d => d.MinSalary).HasColumnType("decimal(18,2)");
        builder.Property(d => d.MaxSalary).HasColumnType("decimal(18,2)");

        builder.HasOne(d => d.Department)
               .WithMany(dept => dept.Designations)
               .HasForeignKey(d => d.DepartmentId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.Property(d => d.CreatedAt).HasColumnType("datetime2");
        builder.Property(d => d.UpdatedAt).HasColumnType("datetime2");
    }
}
