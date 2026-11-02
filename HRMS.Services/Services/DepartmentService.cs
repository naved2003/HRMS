using AutoMapper;
using HRMS.Core.Entities;
using HRMS.Core.Interfaces;
using HRMS.Services.DTOs;
using HRMS.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace HRMS.Services.Services;

public sealed class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<DepartmentService> _logger;

    public DepartmentService(IDepartmentRepository repository, IMapper mapper, ILogger<DepartmentService> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<IEnumerable<DepartmentDto>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<DepartmentDto>>(entities);
    }

    public async Task<DepartmentDto?> GetByIdAsync(int id)
    {
        var dept = await _repository.GetDepartmentWithManagerAsync(id);
        return dept is null ? null : _mapper.Map<DepartmentDto>(dept);
    }

    public async Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto)
    {
        if (!await _repository.IsCodeUniqueAsync(dto.Code))
        {
            throw new InvalidOperationException($"A department with code '{dto.Code}' already exists.");
        }
        var entity = _mapper.Map<Department>(dto);
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
        await _repository.AddAsync(entity);
        _logger.LogInformation("Department created with id {Id}", entity.Id);
        return _mapper.Map<DepartmentDto>(entity);
    }

    public async Task<DepartmentDto?> UpdateAsync(int id, UpdateDepartmentDto dto)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing is null) return null;

        if (!await _repository.IsCodeUniqueForIdAsync(id, dto.Code))
        {
            throw new InvalidOperationException($"A department with code '{dto.Code}' already exists.");
        }

        existing.Name = dto.Name;
        existing.Code = dto.Code;
        existing.Description = dto.Description;
        existing.ManagerId = dto.ManagerId;
        existing.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(existing);
        return _mapper.Map<DepartmentDto>(existing);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing is null) return false;
        await _repository.DeleteAsync(existing);
        return true;
    }
}
