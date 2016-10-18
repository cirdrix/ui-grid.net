namespace WebApplication1.Models
{
    using System.Collections.Generic;

    using Newtonsoft.Json;

    public enum UiGridSort
    {
        asc,
        desc,
    }

    public class UiGridRequestBase
    {
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
        public UiGridSort? SortDirection { get; set; }
        public string SortColumn { get; set; }
        public string FilterColumnsJson { get; set; }
        public IList<UiGridFilterRequest> FilterColumns
        {
            get
            {
                if (string.IsNullOrWhiteSpace(this.FilterColumnsJson))
                {
                    return new List<UiGridFilterRequest>();
                }

                return JsonConvert.DeserializeObject<IList<UiGridFilterRequest>>(this.FilterColumnsJson);
            }
        }
    }
}