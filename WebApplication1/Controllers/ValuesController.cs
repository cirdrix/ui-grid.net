namespace WebApplication1.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Dynamic;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    using Newtonsoft.Json;

    using WebApplication1.Models;

    public class UiGridConstants
    {
        public const int STARTS_WITH = 2;
        public const int ENDS_WITH = 4;
        public const int EXACT = 8;
        public const int CONTAINS = 16;
        public const int GREATER_THAN = 32;
        public const int GREATER_THAN_OR_EQUAL = 64;

        public const int LESS_THAN = 128;
        public const int LESS_THAN_OR_EQUAL = 256;
        public const int NOT_EQUAL = 512;
    }

    public class ValuesController : ApiController
    {
        // GET api/values
        public HttpResponseMessage Get([FromUri] MyModelRequest request)
        {
            string readText = System.IO.File.ReadAllText(System.Web.Hosting.HostingEnvironment.MapPath("/data/500_complex.json"));
            var list = JsonConvert.DeserializeObject<IEnumerable<MyModel>>(readText);
           

            foreach (var filterColumn in request.FilterColumns)
            {
                if (!string.IsNullOrWhiteSpace(filterColumn.Term))
                { 
                    switch (filterColumn.Condition)
                    {
                        case UiGridConstants.GREATER_THAN_OR_EQUAL:
                            list = list.Where(string.Format("{0} >= @0", typeof(MyModel).GetProperty(filterColumn.Column).Name), Convert.ChangeType(filterColumn.Term, typeof(MyModel).GetProperty(filterColumn.Column).PropertyType));
                            break;
                        case UiGridConstants.LESS_THAN_OR_EQUAL:
                            list = list.Where(string.Format("{0} <= @0", typeof(MyModel).GetProperty(filterColumn.Column).Name), Convert.ChangeType(filterColumn.Term, typeof(MyModel).GetProperty(filterColumn.Column).PropertyType));
                            break;
                        case UiGridConstants.EXACT:
                            list = list.Where(string.Format("{0} = @0", typeof(MyModel).GetProperty(filterColumn.Column).Name), Convert.ChangeType(filterColumn.Term, typeof(MyModel).GetProperty(filterColumn.Column).PropertyType));
                            break;
                        case UiGridConstants.CONTAINS:
                            list = list.Where(string.Format("{0}.ToLower().Contains(@0)", typeof(MyModel).GetProperty(filterColumn.Column).Name), filterColumn.Term.ToLower());
                            break;
                    }
                }
                //switch (filterColumn.Column)
                //{
                //    case "Id":

                //        typeof(MyModel).GetProperty("filterColumn.Column").GetType()

                //        int id = 0;
                //        if (int.TryParse(filterColumn.Term, out id))
                //        {
                //            list = list.Where(p => p.Id == id);
                //        }

                //        break;
                //    case "Gender":
                //        if (!string.IsNullOrWhiteSpace(filterColumn.Term))
                //        {
                //            list = list.Where(p => p.Gender == filterColumn.Term);
                //        }

                //        break;
                //    case "Name":
                //        if (!string.IsNullOrWhiteSpace(filterColumn.Term))
                //        {
                //            list = list.Where(p => p.Name != null && p.Name.ToLower().Contains(filterColumn.Term.ToLower()));
                //        }

                //        break;
                //    case "Age":
                //        if (!string.IsNullOrWhiteSpace(filterColumn.Term))
                //        {
                //            int age = 0;
                //            if (int.TryParse(filterColumn.Term, out age))
                //            {
                //                if (filterColumn.Condition == "32")
                //                {
                //                    // greather than
                //                    list = list.Where(p => p.Age >= age);
                //                }
                //                else if (filterColumn.Condition == "128")
                //                {
                //                    // less than
                //                    list = list.Where(p => p.Age <= age);
                //                }
                //            }
                //        }

                //        break;
                //    case "Registered":
                //        if (!string.IsNullOrWhiteSpace(filterColumn.Term))
                //        {
                //            DateTime filterDate = DateTime.MinValue;
                //            if (DateTime.TryParse(filterColumn.Term, out filterDate))
                //            {
                //                if (filterColumn.Condition == "32")
                //                {
                //                    // greather than
                //                    list = list.Where(p => p.Registered >= filterDate);
                //                }
                //                else if (filterColumn.Condition == "128")
                //                {
                //                    // less than
                //                    list = list.Where(p => p.Registered <= filterDate);
                //                }
                //            }
                //        }

                //        break;
                //}
            }

            var vm = new UiGridViewModel<MyModel>();
            vm.TotalItems = list.Count();
            var orderedResults = list.AsEnumerable();
            if (!string.IsNullOrEmpty(request.SortColumn))
            {
                orderedResults = list.OrderBy(string.Format("{0}{1}",request.SortColumn,request.SortDirection == UiGridSort.desc ? " descending" : string.Empty));
            }

            vm.Items = orderedResults.Skip(request.PageSize * (request.PageNumber - 1)).Take(request.PageSize);

            return this.Request.CreateResponse(HttpStatusCode.OK, vm);
        }
    }
}