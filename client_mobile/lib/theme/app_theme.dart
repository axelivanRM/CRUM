
import 'package:flutter/material.dart';

abstract final class AppTheme {
  static ThemeData get light {
    return ThemeData(
      useMaterial3: true,

      // Colores globales
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFF6750A4),
        brightness: Brightness.light,
      ),

      scaffoldBackgroundColor: const Color(0xFFF7F7F7),

      // Tipografía global
      fontFamily: 'Roboto',

      // Estilo predeterminado de los botones
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF6750A4),
          foregroundColor: Colors.white,
          elevation: 3,
          minimumSize: const Size(double.infinity, 48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),

      // Estilo predeterminado de los campos de texto
      inputDecorationTheme: InputDecorationTheme(
        hintStyle: const TextStyle(
          color: Color(0xFF888888),
          fontSize: 14,
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 18,
          vertical: 15,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(24),
          borderSide: const BorderSide(
            color: Color(0xFF929292),
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(24),
          borderSide: const BorderSide(
            color: Color(0xFF6750A4),
            width: 1.5,
          ),
        ),
      ),

      // Estilo de las barras superiores
      appBarTheme: const AppBarTheme(
        backgroundColor: Color(0xFFF7F7F7),
        foregroundColor: Color(0xFF222222),
        elevation: 0,
        centerTitle: true,
      ),
    );
  }
}
