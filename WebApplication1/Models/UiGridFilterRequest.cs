namespace WebApplication1.Models
{
    public class UiGridFilterRequest
    {
        public string Column { get; set; }
        public int? Condition { get; set; }
        public string Term { get; set; }
    }
}