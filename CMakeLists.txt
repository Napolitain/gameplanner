cmake_minimum_required(VERSION 3.20)
project(GamePlanner VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Library
add_subdirectory(lib)

# Examples
add_subdirectory(examples)

# Windows UI Application (WinUI3)
if(WIN32)
    add_subdirectory(winui)
endif()
