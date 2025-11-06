//! Game Planner Core Library
//!
//! A cross-platform library for planning and managing build orders/action sequences
//! in strategy games. Supports any game where actions need to be sequenced and optimized.

pub mod build_order;
pub mod chess;
pub mod game;

#[cfg(test)]
mod build_order_tests;
#[cfg(test)]
mod chess_tests;
#[cfg(test)]
mod fory_tests;
#[cfg(test)]
mod game_tests;

pub use build_order::{BuildOrder, BuildOrderStep};
pub use chess::ChessGame;
pub use game::{Game, GameItem, Resource};
