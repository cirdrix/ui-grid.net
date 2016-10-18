namespace WebApplication1.Models
{
    using System.Collections.Generic;

    public class UiGridViewModel<T>
    {
        public int TotalItems { get; set; }
        public IEnumerable<T> Items { get; set; }
    }
}