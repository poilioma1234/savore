import { useEffect } from 'react';
import {
  DashboardOutlined,
  InboxOutlined,
  SendOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
  SettingOutlined,
  BarChartOutlined,
  TeamOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useMenuStore } from '../stores/menuStore';

export const useMenuConfig = () => {
  const { setMenuItems } = useMenuStore();

  useEffect(() => {
    // Menu configuration - simplified structure matching menuStore.ts
    const menuConfig = [
      {
        key: "dashboard",
        label: "menu.dashboard",
        path: "/dashboard",
        icon: <DashboardOutlined />,
        children: []
      },
      {
        key: "recipes",
        label: "menu.recipes",
        path: "/recipes",
        icon: <InboxOutlined />,
        children: [
          {
            key: "main",
            label: "menu.mainCourse",
            icon: <FireOutlined />,
            path: "/recipes/main"
          },
          {
            key: "side",
            label: "menu.sideDish",
            icon: <AppstoreOutlined />,
            path: "/recipes/side"
          },
          {
            key: "soup",
            label: "menu.soup",
            icon: <DatabaseOutlined />,
            path: "/recipes/soup"
          },
          {
            key: "salad",
            label: "menu.salad",
            icon: <DatabaseOutlined />,
            path: "/recipes/salad"
          },
          {
            key: "dessert",
            label: "menu.dessert",
            icon: <DatabaseOutlined />,
            path: "/recipes/dessert"
          },
          {
            key: "drink",
            label: "menu.drink",
            icon: <DatabaseOutlined />,
            path: "/recipes/drink"
          }
        ]
      },
      {
        key: "inbound",
        label: "menu.inbound",
        path: "/inbound",
        icon: <SendOutlined />,
        children: [
          {
            key: "receipts",
            label: "menu.receipts",
            path: "/inbound/receipts"
          },
          {
            key: "receipt-types",
            label: "menu.receiptTypes",
            path: "/inbound/receipt-types"
          },
          {
            key: "receipt-validations",
            label: "menu.receiptValidations",
            path: "/inbound/receipt-validations"
          }
        ]
      },
      {
        key: "outbound",
        label: "menu.outbound",
        path: "/outbound",
        icon: <SendOutlined />,
        children: [
          {
            key: "shipments",
            label: "menu.shipments",
            path: "/outbound/shipments"
          },
          {
            key: "shipment-types",
            label: "menu.shipmentTypes",
            path: "/outbound/shipment-types"
          }
        ]
      },
      {
        key: "inventory",
        label: "menu.inventory",
        path: "/inventory",
        icon: <DatabaseOutlined />,
        children: [
          {
            key: "inventory-balances",
            label: "menu.inventoryBalances",
            path: "/inventory/inventory-balances"
          },
          {
            key: "inventory-counts",
            label: "menu.inventoryCounts",
            path: "/inventory/inventory-counts"
          }
        ]
      },
      {
        key: "partner",
        label: "menu.partner",
        path: "/partner",
        icon: <TeamOutlined />,
        children: [
          {
            key: "carriers",
            label: "menu.carriers",
            path: "/partner/carriers"
          },
          {
            key: "customer",
            label: "menu.customer",
            path: "/partner/customer"
          }
        ]
      },
      {
        key: "master-data",
        label: "menu.masterData",
        path: "/master-data",
        icon: <AppstoreOutlined />,
        children: [
          {
            key: "items",
            label: "menu.items",
            path: "/master-data/items"
          },
          {
            key: "locations",
            label: "menu.locations",
            path: "/master-data/locations"
          }
        ]
      },
      {
        key: "strategy",
        label: "menu.strategy",
        path: "/strategy",
        icon: <SettingOutlined />,
        children: [
          {
            key: "allocation-strategies",
            label: "menu.allocationStrategies",
            path: "/strategy/allocation-strategies"
          },
          {
            key: "putaway-strategies",
            label: "menu.putawayStrategies",
            path: "/strategy/putaway-strategies"
          }
        ]
      },
      {
        key: "tasks-and-logs",
        label: "menu.tasksAndLogs",
        path: "/tasks-and-logs",
        icon: <FileTextOutlined />,
        children: [
          {
            key: "operation-tasks",
            label: "menu.operationTasks",
            path: "/tasks-and-logs/operation-tasks"
          }
        ]
      },
      {
        key: "system",
        label: "menu.system",
        path: "/system",
        icon: <SettingOutlined />,
        children: [
          {
            key: "facilities",
            label: "menu.facilities",
            path: "/system/facilities"
          },
          {
            key: "users",
            label: "menu.users",
            path: "/system/users"
          }
        ]
      },
      {
        key: "report",
        label: "menu.report",
        path: "/report",
        icon: <BarChartOutlined />
      }
    ];

    setMenuItems(menuConfig);
  }, [setMenuItems]);
};