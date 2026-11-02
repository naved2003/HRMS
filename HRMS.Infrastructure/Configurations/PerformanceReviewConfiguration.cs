using HRMS.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRMS.Infrastructure.Configurations;

public class PerformanceReviewConfiguration : IEntityTypeConfiguration<PerformanceReview>
{
    public void Configure(EntityTypeBuilder<PerformanceReview> builder)
    {
        builder.ToTable("PerformanceReviews");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.ReviewPeriod).IsRequired().HasMaxLength(50);
        builder.Property(p => p.Goals).HasMaxLength(2000);
        builder.Property(p => p.Achievements).HasMaxLength(2000);
        builder.Property(p => p.Feedback).HasMaxLength(2000);

        builder.HasOne(p => p.Employee)
               .WithMany()
               .HasForeignKey(p => p.EmployeeId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.ReviewedBy)
               .WithMany()
               .HasForeignKey(p => p.ReviewedById)
               .OnDelete(DeleteBehavior.Restrict);

        builder.Property(p => p.ReviewDate).HasColumnType("date");
        builder.Property(p => p.CreatedAt).HasColumnType("datetime2");
    }
}
