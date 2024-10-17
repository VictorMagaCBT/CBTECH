import re
from datetime import datetime

def validate_nif(nif):
    """
    Valida um NIF português.
    """
    if not re.match(r'^\d{9}$', nif):
        return False
    
    check_digit = int(nif[8])
    total = sum(int(nif[i]) * (9 - i) for i in range(8))
    remainder = total % 11
    
    if remainder == 0 or remainder == 1:
        return check_digit == 0
    else:
        return check_digit == (11 - remainder)

def format_date(date_string):
    """
    Formata uma string de data para o formato dd/mm/yyyy.
    """
    date = datetime.strptime(date_string, "%Y-%m-%d")
    return date.strftime("%d/%m/%Y")

def calculate_total_value(assistencias):
    """
    Calcula o valor total de uma lista de assistências.
    """
    return sum(assistencia.valor for assistencia in assistencias)