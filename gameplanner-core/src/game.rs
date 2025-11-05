use serde::{Deserialize, Serialize};
use std::sync::Arc;

/// Represents a resource type (e.g., time, material cost)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Resource {
    pub name: String,
    pub amount: f64,
}

impl Resource {
    pub fn new(name: impl Into<String>, amount: f64) -> Self {
        Self {
            name: name.into(),
            amount,
        }
    }
}

/// Represents a single action/move that can be performed in a game
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameItem {
    pub id: String,
    pub name: String,
    pub category: String,
    pub description: String,
    pub time_cost: f64,
    pub resources: Vec<Resource>,
}

impl GameItem {
    pub fn new(
        id: impl Into<String>,
        name: impl Into<String>,
        category: impl Into<String>,
    ) -> Self {
        Self {
            id: id.into(),
            name: name.into(),
            category: category.into(),
            description: String::new(),
            time_cost: 0.0,
            resources: Vec::new(),
        }
    }

    pub fn with_description(mut self, description: impl Into<String>) -> Self {
        self.description = description.into();
        self
    }

    pub fn with_time_cost(mut self, time_cost: f64) -> Self {
        self.time_cost = time_cost;
        self
    }

    pub fn with_resource(mut self, resource: Resource) -> Self {
        self.resources.push(resource);
        self
    }
}

/// Represents a game with its rules and available actions
#[derive(Debug, Clone)]
pub struct Game {
    pub id: String,
    pub name: String,
    pub description: String,
    pub items: Vec<Arc<GameItem>>,
}

impl Game {
    pub fn new(id: impl Into<String>, name: impl Into<String>) -> Self {
        Self {
            id: id.into(),
            name: name.into(),
            description: String::new(),
            items: Vec::new(),
        }
    }

    pub fn with_description(mut self, description: impl Into<String>) -> Self {
        self.description = description.into();
        self
    }

    pub fn add_item(&mut self, item: GameItem) {
        self.items.push(Arc::new(item));
    }

    pub fn find_item(&self, id: &str) -> Option<Arc<GameItem>> {
        self.items.iter().find(|item| item.id == id).cloned()
    }
}
