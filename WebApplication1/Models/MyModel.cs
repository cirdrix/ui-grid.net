using System;

namespace WebApplication1.Models
{
    public class MyModel
    {
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public bool IsActive { get; set; }
        public int Age { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public string Company { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime Registered { get; set; }
    }
}