// Template configurations for different project types
const TEMPLATES = {
    "Todo Template": {
        name: "Todo Template",
        description: "Simple task management with basic workflow",
        lists: [
            { title: "To Do", order: 1 },
            { title: "Doing", order: 2 },
            { title: "Done", order: 3 }
        ],
        defaultCards: [
            {
                listTitle: "To Do",
                title: "Welcome to your Todo board!",
                description: "Start by adding your tasks here",
                order: 1
            }
        ]
    },
    "Project Template": {
        name: "Project Template",
        description: "Complete project management workflow",
        lists: [
            { title: "Backlog", order: 1 },
            { title: "Planning", order: 2 },
            { title: "In Progress", order: 3 },
            { title: "Review", order: 4 },
            { title: "Testing", order: 5 },
            { title: "Completed", order: 6 }
        ],
        defaultCards: [
            {
                listTitle: "Backlog",
                title: "Define project requirements",
                description: "Gather and document all project requirements",
                order: 1
            },
            {
                listTitle: "Planning",
                title: "Create project timeline",
                description: "Set milestones and deadlines",
                order: 1
            }
        ]
    },
    "Table": {
        name: "Table Template",
        description: "Flexible kanban board",
        lists: [
            { title: "To Do", order: 1 },
            { title: "In Progress", order: 2 },
            { title: "Done", order: 3 }
        ],
        defaultCards: []
    },
    "Agile Sprint": {
        name: "Agile Sprint",
        description: "Agile sprint planning and tracking",
        lists: [
            { title: "Sprint Backlog", order: 1 },
            { title: "In Progress", order: 2 },
            { title: "Code Review", order: 3 },
            { title: "Testing", order: 4 },
            { title: "Done", order: 5 }
        ],
        defaultCards: [
            {
                listTitle: "Sprint Backlog",
                title: "Sprint Planning",
                description: "Plan the sprint goals and tasks",
                order: 1
            }
        ]
    },
    "Bug Tracking": {
        name: "Bug Tracking",
        description: "Track and manage bugs",
        lists: [
            { title: "Reported", order: 1 },
            { title: "Confirmed", order: 2 },
            { title: "In Progress", order: 3 },
            { title: "Fixed", order: 4 },
            { title: "Verified", order: 5 }
        ],
        defaultCards: []
    },
    "Marketing Campaign": {
        name: "Marketing Campaign",
        description: "Plan and execute marketing campaigns",
        lists: [
            { title: "Ideas", order: 1 },
            { title: "Planning", order: 2 },
            { title: "In Progress", order: 3 },
            { title: "Review", order: 4 },
            { title: "Published", order: 5 }
        ],
        defaultCards: [
            {
                listTitle: "Ideas",
                title: "Brainstorm campaign ideas",
                description: "Collect creative ideas for the campaign",
                order: 1
            }
        ]
    }
};

module.exports = { TEMPLATES };
