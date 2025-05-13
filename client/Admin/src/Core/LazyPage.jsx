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
           PendingVendors: lazy(() => import("../page/private/PendingVendors/PendingVendors")),


        

    
  }
};

export default Lazy;
