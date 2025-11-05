//! Game Planner Core Library
//!
//! A cross-platform library for planning and managing build orders/action sequences
//! in strategy games. Supports any game where actions need to be sequenced and optimized.

pub mod game;
pub mod build_order;
pub mod chess;

pub use game::{Game, GameItem, Resource};
pub use build_order::{BuildOrder, BuildOrderStep};
pub use chess::ChessGame;
