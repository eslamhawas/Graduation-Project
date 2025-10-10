import { lazy } from "react";

const Lazy = {
  Auth: {
    Signin: lazy(() => import("../page/Auth/Signin/Signin"))
  },
  private: {
    AllVendors: lazy(() => import("../page/private/AllVendors/AllVendors")),
    AllUser: lazy(() => import("../page/private/AllUser/AllUser")),
    BinUser: lazy(() => import("../page/private/BinUser/BinUser")),
    AllAdmin: lazy(() => import("../page/private/AllAdmin/AllAdmin")),
    PendingVendors: lazy(() =>
      import("../page/private/PendingVendors/PendingVendors")
    ),
    AllProduct: lazy(() => import("../page/private/AllProduct/AllProduct")),
    AddProduct: lazy(() => import("../page/private/AllProduct/AddProduct")),
    MyProducts: lazy(() => import("../page/private/AllProduct/MyProducts")),
    AddProductMe: lazy(() => import("../page/private/AllProduct/AddProductMe")),
    PromotionProduct: lazy(() =>
      import("../page/private/promotions/promotionsProduct")
    ),
    AllOrder: lazy(() => import("../page/private/AllOrder/AllOrder")),
    Transaction: lazy(() => import("../page/private/transaction/transaction"))
  }
};

export default Lazy;
