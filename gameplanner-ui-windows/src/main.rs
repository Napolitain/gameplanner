#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use gameplanner_core::{BuildOrder, ChessGame, Game};
use windows::{
    core::Result,
    Win32::Foundation::*,
    Win32::Graphics::Gdi::*,
    Win32::System::LibraryLoader::GetModuleHandleW,
    Win32::UI::WindowsAndMessaging::*,
};

const WINDOW_WIDTH: i32 = 1024;
const WINDOW_HEIGHT: i32 = 768;

struct AppState {
    game: Game,
    build_order: BuildOrder,
    selected_item_index: Option<usize>,
}

impl AppState {
    fn new() -> Self {
        Self {
            game: ChessGame::create(),
            build_order: BuildOrder::new("New Build Order"),
            selected_item_index: None,
        }
    }
}

fn main() -> Result<()> {
    unsafe {
        let instance = GetModuleHandleW(None)?;
        
        let window_class = w!("GamePlannerWindowClass");
        
        let wc = WNDCLASSW {
            style: CS_HREDRAW | CS_VREDRAW,
            lpfnWndProc: Some(wndproc),
            hInstance: instance.into(),
            hCursor: LoadCursorW(None, IDC_ARROW)?,
            hbrBackground: HBRUSH((COLOR_WINDOW.0 + 1) as isize),
            lpszClassName: window_class,
            ..Default::default()
        };

        RegisterClassW(&wc);

        let hwnd = CreateWindowExW(
            WINDOW_EX_STYLE::default(),
            window_class,
            w!("Game Planner - Chess"),
            WS_OVERLAPPEDWINDOW | WS_VISIBLE,
            CW_USEDEFAULT,
            CW_USEDEFAULT,
            WINDOW_WIDTH,
            WINDOW_HEIGHT,
            None,
            None,
            instance,
            None,
        )?;

        ShowWindow(hwnd, SW_SHOW);
        UpdateWindow(hwnd)?;

        let mut msg = MSG::default();
        while GetMessageW(&mut msg, None, 0, 0).into() {
            TranslateMessage(&msg);
            DispatchMessageW(&msg);
        }

        Ok(())
    }
}

extern "system" fn wndproc(hwnd: HWND, msg: u32, wparam: WPARAM, lparam: LPARAM) -> LRESULT {
    unsafe {
        match msg {
            WM_CREATE => {
                // Initialize app state
                let state = Box::new(AppState::new());
                SetWindowLongPtrW(hwnd, GWLP_USERDATA, Box::into_raw(state) as isize);
                LRESULT(0)
            }
            WM_PAINT => {
                let state_ptr = GetWindowLongPtrW(hwnd, GWLP_USERDATA) as *mut AppState;
                if !state_ptr.is_null() {
                    let state = &*state_ptr;
                    paint_window(hwnd, state);
                }
                LRESULT(0)
            }
            WM_LBUTTONDOWN => {
                // Handle mouse clicks for UI interaction
                InvalidateRect(hwnd, None, true);
                LRESULT(0)
            }
            WM_DESTROY => {
                let state_ptr = GetWindowLongPtrW(hwnd, GWLP_USERDATA) as *mut AppState;
                if !state_ptr.is_null() {
                    drop(Box::from_raw(state_ptr));
                }
                PostQuitMessage(0);
                LRESULT(0)
            }
            _ => DefWindowProcW(hwnd, msg, wparam, lparam),
        }
    }
}

unsafe fn paint_window(hwnd: HWND, state: &AppState) {
    let mut ps = PAINTSTRUCT::default();
    let hdc = BeginPaint(hwnd, &mut ps);

    // Get client rect
    let mut rect = RECT::default();
    GetClientRect(hwnd, &mut rect);

    // Set up drawing
    SetBkMode(hdc, TRANSPARENT);

    // Draw title
    let title = "Game Planner - Chess Move Sequencer";
    let title_wide: Vec<u16> = title.encode_utf16().chain(std::iter::once(0)).collect();
    
    let mut title_rect = RECT {
        left: 10,
        top: 10,
        right: rect.right - 10,
        bottom: 50,
    };
    
    let mut font_struct = LOGFONTW::default();
    font_struct.lfHeight = 24;
    font_struct.lfWeight = FW_BOLD.0 as i32;
    let font = CreateFontIndirectW(&font_struct);
    SelectObject(hdc, font);
    
    DrawTextW(hdc, &title_wide, &mut title_rect, DT_LEFT | DT_TOP);

    // Draw game info
    let game_info = format!("Game: {} - {} moves available", state.game.name, state.game.items.len());
    let info_wide: Vec<u16> = game_info.encode_utf16().chain(std::iter::once(0)).collect();
    
    let mut info_rect = RECT {
        left: 10,
        top: 50,
        right: rect.right - 10,
        bottom: 80,
    };
    
    // Normal font for body text
    let mut normal_font_struct = LOGFONTW::default();
    normal_font_struct.lfHeight = 16;
    let normal_font = CreateFontIndirectW(&normal_font_struct);
    SelectObject(hdc, normal_font);
    
    DrawTextW(hdc, &info_wide, &mut info_rect, DT_LEFT | DT_TOP);

    // Draw available moves section
    let moves_title = "Available Moves:";
    let moves_title_wide: Vec<u16> = moves_title.encode_utf16().chain(std::iter::once(0)).collect();
    
    let mut moves_title_rect = RECT {
        left: 10,
        top: 90,
        right: 300,
        bottom: 110,
    };
    DrawTextW(hdc, &moves_title_wide, &mut moves_title_rect, DT_LEFT | DT_TOP);

    // Draw sample moves
    let mut y_pos = 120;
    for (i, item) in state.game.items.iter().take(15).enumerate() {
        let move_text = format!("{}. {} - {}", i + 1, item.name, item.category);
        let move_wide: Vec<u16> = move_text.encode_utf16().chain(std::iter::once(0)).collect();
        
        let mut move_rect = RECT {
            left: 20,
            top: y_pos,
            right: 300,
            bottom: y_pos + 20,
        };
        DrawTextW(hdc, &move_wide, &mut move_rect, DT_LEFT | DT_TOP);
        y_pos += 25;
    }

    // Draw build order section
    let bo_title = "Current Build Order:";
    let bo_title_wide: Vec<u16> = bo_title.encode_utf16().chain(std::iter::once(0)).collect();
    
    let mut bo_title_rect = RECT {
        left: 320,
        top: 90,
        right: rect.right - 10,
        bottom: 110,
    };
    DrawTextW(hdc, &bo_title_wide, &mut bo_title_rect, DT_LEFT | DT_TOP);

    // Draw build order steps
    if state.build_order.steps.is_empty() {
        let empty_text = "No moves added yet. Click on moves to add them.";
        let empty_wide: Vec<u16> = empty_text.encode_utf16().chain(std::iter::once(0)).collect();
        
        let mut empty_rect = RECT {
            left: 330,
            top: 120,
            right: rect.right - 10,
            bottom: 150,
        };
        DrawTextW(hdc, &empty_wide, &mut empty_rect, DT_LEFT | DT_TOP);
    } else {
        let mut y_pos = 120;
        for step in &state.build_order.steps {
            let step_text = format!("{}. {}", step.step_number, step.item.name);
            let step_wide: Vec<u16> = step_text.encode_utf16().chain(std::iter::once(0)).collect();
            
            let mut step_rect = RECT {
                left: 330,
                top: y_pos,
                right: rect.right - 10,
                bottom: y_pos + 20,
            };
            DrawTextW(hdc, &step_wide, &mut step_rect, DT_LEFT | DT_TOP);
            y_pos += 25;
        }
    }

    // Draw instructions at bottom
    let instructions = "Note: Full UI interaction requires WinUI3 or more advanced Win32 controls. This is a basic demonstration.";
    let inst_wide: Vec<u16> = instructions.encode_utf16().chain(std::iter::once(0)).collect();
    
    let mut inst_rect = RECT {
        left: 10,
        top: rect.bottom - 40,
        right: rect.right - 10,
        bottom: rect.bottom - 10,
    };
    DrawTextW(hdc, &inst_wide, &mut inst_rect, DT_LEFT | DT_TOP | DT_WORDBREAK);

    DeleteObject(font);
    DeleteObject(normal_font);
    EndPaint(hwnd, &ps);
}
