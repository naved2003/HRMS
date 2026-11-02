using HRMS.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRMS.Infrastructure.Configurations;

public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.ToTable("AspNetUsers");

        builder.Property(u => u.FirstName)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(u => u.LastName)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(u => u.EmployeeId)
               .IsRequired(false);

        builder.HasOne(u => u.Employee)
               .WithOne(e => e.User)
               .HasForeignKey<Employee>(e => e.UserId)
               .IsRequired(false)
               .OnDelete(DeleteBehavior.SetNull);

        builder.Property(u => u.HireDate).HasColumnType("datetime2");
        builder.Property(u => u.CreatedAt).HasColumnType("datetime2");
        builder.Property(u => u.UpdatedAt).HasColumnType("datetime2");
    }
}
