use crate::game::GameItem;
use fory::ForyObject;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

/// Represents a single step in a build order/action sequence
#[derive(Debug, Clone, Serialize, Deserialize, ForyObject)]
pub struct BuildOrderStep {
    pub step_number: i32,
    pub item: Arc<GameItem>,
    pub notes: String,
}

impl BuildOrderStep {
    /// Creates a new build order step
    ///
    /// Note: `step_number` is accepted as `usize` for ergonomics but stored as `i32`
    /// internally for Apache Fory serialization compatibility (Fory 0.13.0 doesn't support
    /// unsigned integer types like usize/u32 yet).
    pub fn new(step_number: usize, item: Arc<GameItem>) -> Self {
        Self {
            step_number: step_number as i32,
            item,
            notes: String::new(),
        }
    }

    pub fn with_notes(mut self, notes: impl Into<String>) -> Self {
        self.notes = notes.into();
        self
    }
}

/// Represents a complete action sequence/build order
#[derive(Debug, Clone, Serialize, Deserialize, ForyObject)]
pub struct BuildOrder {
    pub name: String,
    pub steps: Vec<BuildOrderStep>,
}

impl BuildOrder {
    pub fn new(name: impl Into<String>) -> Self {
        Self {
            name: name.into(),
            steps: Vec::new(),
        }
    }

    pub fn add_step(&mut self, item: Arc<GameItem>) {
        let step_number = self.steps.len() + 1;
        self.steps.push(BuildOrderStep::new(step_number, item));
    }

    pub fn add_step_with_notes(&mut self, item: Arc<GameItem>, notes: impl Into<String>) {
        let step_number = self.steps.len() + 1;
        self.steps
            .push(BuildOrderStep::new(step_number, item).with_notes(notes));
    }

    pub fn remove_step(&mut self, index: usize) {
        if index < self.steps.len() {
            self.steps.remove(index);
            self.renumber_steps();
        }
    }

    pub fn move_step(&mut self, from: usize, to: usize) {
        if from < self.steps.len() && to < self.steps.len() && from != to {
            let step = self.steps.remove(from);
            self.steps.insert(to, step);
            self.renumber_steps();
        }
    }

    pub fn clear(&mut self) {
        self.steps.clear();
    }

    fn renumber_steps(&mut self) {
        for (i, step) in self.steps.iter_mut().enumerate() {
            step.step_number = (i + 1) as i32;
        }
    }

    pub fn total_time(&self) -> f64 {
        self.steps.iter().map(|step| step.item.time_cost).sum()
    }
}

#[cfg(test)]
#[path = "build_order_tests.rs"]
mod tests;
