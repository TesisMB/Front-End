export interface FoodNode {
    name: string,
    patch?: any,
    icon: string,
    children?: FoodNode[],
    role: any[],
    disabled?: boolean
  }



  export interface Notifications{
    hasNotifications: boolean,
    number: number
  }
 export interface Notifys{

        id: number,
        message: string,
        state: boolean,
        createDate: string,
        url: string
  }
  export const NOTIFY_DATA: Notifys[] = [
    {
      id: 1,
      message: 'Esta es una notificacion',
      state: true,
      createDate: '15-11-2021',
      url: null
    },
    {
      id: 2,
      message: 'Esta es la segunda notificacion',
      state: true,
      createDate: '14-11-2021',
      url: null
    },
     {
      id: 3,
      message: 'Esta es la 3ra notificacion',
      state: false,
      createDate: '13-11-2021',
      url: null
    }
  ];

  export const TREE_DATA: FoodNode[] = [
    {
      name: 'Inicio',
      patch:'/',
      icon:'fas fa-home' ,
      role:['Admin','Coord. General','Coord. De Gestión de Riesgo', 'Enc. De logística']
    },
    {
      name: 'Usuarios',
      patch:'empleados',
      icon:'fas fa-users' ,
      role:['Admin','Coord. General', ,'Coord. De Gestión de Riesgo'],
      disabled: true,
      children: [
        {name: 'Lista de usuarios',
        patch:'/empleados',
        icon:'fas fa-user-plus',
        role:['Admin','Coord. General']
      },
      {
        name: 'Lista de voluntarios',
        patch:'/recursos/lista/voluntarios',
        icon:'fas fa-hands-helping',
        role:['Admin','Coord. General','Coord. De Gestión de Riesgo']
      }
    ]
    },
    {
      name: 'Gestión de recursos',
      patch: 'recursos',
      icon:'fas fa-first-aid',
      role:['Admin','Coord. General','Enc. De logística','Coord. De Gestión de Riesgo'],
      children: [
        {
          name: 'Medicamentos',
          patch:'/recursos/lista/medicamentos',
          icon:'fas fa-capsules',
          role:['Admin','Coord. General','Enc. De logística','Coord. De Gestión de Riesgo']
        },
        {
          name: 'Materiales',
          patch:'/recursos/lista/materiales',
          icon:'fas fa-thermometer',
          role:['Admin','Coord. General','Enc. De logística','Coord. De Gestión de Riesgo']
        },
        {
          name: 'Vehiculos',
          patch:'/recursos/lista/vehiculos',
          icon:'fas fa-ambulance',
          role:['Admin','Coord. General','Enc. De logística','Coord. De Gestión de Riesgo']
        },
      ]
    },
    {
      name: 'Stock',
      patch:'/recursos/stock',
      icon:'fas fa-list-alt',
      role:['Admin','Coord. General','Enc. De logística']
    },
    {
      name: 'Solicitudes',
      patch:'/recursos/solicitudes',
      icon:'fas fa-clipboard-list' ,
      role:['Admin','Coord. General','Enc. De logística']
    },
    // {
    //   name: 'Historial de solicitudes',
    //   patch:'/recursos/historial',
    //   icon:'fas fa-clipboard-list' ,
    //   role:['Admin','Coord. General','Enc. De logística']
    // },
    {
      name: 'Alertas',
      patch:'/emergencias',
      icon:'fas fa-briefcase-medical' ,
      role:['Admin','Coord. General','Coord. De Gestión de Riesgo'],
    },
    // {
    //   name: 'Reportes',
    //   patch:'/reportes',
    //   icon:'fas fa-chart-pie' ,
    //   disabled: false,
    //   role:['Admin','Coord. General']
    // },
    {
      name: 'Monitoreo',
      patch:'/monitoreo',
      icon:'fas fa-tv' ,
      disabled: false,
      role:['Admin','Coord. General','Coord. De Gestión de Riesgo','Enc. De logística']
    },
];
