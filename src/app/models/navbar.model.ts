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
      role:['Admin','Coordinador General','Coordinador de Emergencias y Desastres', 'Encargado de Logistica']
    },
    {
      name: 'Usuarios',
      patch:'empleados',
      icon:'fas fa-users' ,
      role:['Admin','Coordinador General', ,'Coordinador de Emergencias y Desastres'],
      disabled: true,
      children: [
        {name: 'Lista de empleados',
        patch:'/empleados',
        icon:'fas fa-user-plus',
        role:['Admin','Coordinador General']
      },
      {
        name: 'Lista de voluntarios',
        patch:'/recursos/lista/voluntarios',
        icon:'fas fa-hands-helping',
        role:['Admin','Coordinador General','Coordinador de Emergencias y Desastres']
      },
      {name: 'Registrar usuario',
      patch:'/empleados/registrar',
      icon:'fas fa-user-plus',
      role:['Admin','Coordinador General']
    },
    ]
    },
    {
      name: 'Gestión de recursos',
      patch: 'recursos',
      icon:'fas fa-first-aid',
      role:['Admin','Coordinador General','Encargado de Logistica','Coordinador de Emergencias y Desastres'],
      children: [
        {
          name: 'Medicamentos',
          patch:'/recursos/lista/medicamentos',
          icon:'fas fa-capsules',
          role:['Admin','Coordinador General','Encargado de Logistica','Coordinador de Emergencias y Desastres']
        },
        {
          name: 'Materiales',
          patch:'/recursos/lista/materiales',
          icon:'fas fa-thermometer',
          role:['Admin','Coordinador General','Encargado de Logistica','Coordinador de Emergencias y Desastres']
        },
        {
          name: 'Vehiculos',
          patch:'/recursos/lista/vehiculos',
          icon:'fas fa-ambulance',
          role:['Admin','Coordinador General','Encargado de Logistica','Coordinador de Emergencias y Desastres']
        },
        {
          name: 'Stock',
          patch:'/recursos/stock',
          icon:'fas fa-list-alt',
          role:['Admin','Coordinador General','Encargado de Logistica']
        },
   
      ]
    },
    {
      name: 'Solicitudes',
      patch:'/recursos/solicitudes',
      icon:'fas fa-clipboard-list' ,
      role:['Admin','Coordinador General','Encargado de Logistica']
    },
    {
      name: 'Historial de solicitudes',
      patch:'/recursos/historial',
      icon:'fas fa-clipboard-list' ,
      role:['Admin','Coordinador General','Encargado de Logistica']
    },
    {
      name: 'Emergencias o desastres',
      patch:'/emergencias',
      icon:'fas fa-briefcase-medical' ,
      role:['Admin','Coordinador General','Coordinador de Emergencias y Desastres'],
      children: [
        {name: 'Registrar emergencia',
        patch:'/emergencias/agregar-emergencia-desastre',
        icon:'fas fa-user-plus',
        role:['Admin','Coordinador General']
      },]
    },
    {
      name: 'Monitoreo',
      patch:'/monitoreo',
      icon:'fas fa-tv' ,
      role:['Admin','Coordinador General','Coordinador de Emergencias y Desastres']
    },
];