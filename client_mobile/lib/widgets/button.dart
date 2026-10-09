
import 'package:flutter/material.dart';

class CrumButton extends StatelessWidget {
  const CrumButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.enabled = true,
    this.width = double.infinity,
    this.height = 48,
  });

  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool enabled;
  final double width;
  final double height;

  @override
  Widget build(BuildContext context) {
    final foregroundColor =
        Theme.of(context).colorScheme.onPrimary;

    return SizedBox(
      width: width,
      height: height,
      child: ElevatedButton(
        onPressed: enabled && !isLoading ? onPressed : null,
        child: isLoading
            ? SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: foregroundColor,
                ),
              )
            : Text(text),
      ),
    );
  }
}
