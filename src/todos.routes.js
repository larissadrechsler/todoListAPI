const express = require("express");
const allTodos = [{ nome: "Larissa", status: false }];
const todosRoutes = express.Router();
const {PrismaClient} = require("@prisma/client");
const { json } = require("express/lib/response");

const prisma = new PrismaClient();

//C

todosRoutes.post("/todos", async (request, response) => {
    const { name } = request.body;
    // allTodos.push({ name, status: false });
    
    const todo = await prisma.todo.create({
        data: {
            name,
        },
    });
    return response.status(201).json(todo);

});

//R

todosRoutes.get("/todos", async (request, response) => {
    const todos = await prisma.todo.findMany()
    return response.status(200).json(todos);
});

// U

todosRoutes.put("/todos", async (request, response) => {
    const {name, id, status} = request.body;
    
    if (!id) {
        return response.status(400).json("ID is mandatory");
    }

    const todoAlreadyExist = await prisma.todo.findUnique({where: {id} });

    if (!todoAlreadyExist){
        return response.status(404).json("Todo not find");
    }

    const todo = await prisma.todo.update({
        where: {
            id,
        },
        data: {
            name,
            status,
        },
    });

    return response.status(200).json(todo);
});

module.exports = todosRoutes;

// D

todosRoutes.delete("/todos/:id", async (request,response) => {
    const { id } = request.params;

    const intID = parseInt(id)

       if (!intID) {
        return response.status(400).json("ID is mandatory");
    }

    const todoAlreadyExist = await prisma.todo.findUnique({where: {id : intID} });

    if (!todoAlreadyExist){
        return response.status(404).json("Todo not find");
    }

    await prisma.todo.delete({where: {id: intID}})

    return response.status(200).send();

});