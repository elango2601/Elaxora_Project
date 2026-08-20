import urllib.request
import urllib.parse
import json
import time

BASE_URL = "http://127.0.0.1:8000/api"

def make_request(path, method="GET", data=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
        
    req_data = None
    if data:
        req_data = json.dumps(data).encode("utf-8")
        
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as res:
            return res.status, json.loads(res.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"HTTPError: {e.code} for {method} {path}. Body: {body}")
        raise e

def run_tests():
    print("Starting integration verification tests...")
    
    # 1. Login Admin
    print("\n[Test 1] Logging in Admin...")
    status, auth_data = make_request("/auth/login", "POST", {
        "email": "admin@elaxorasolutions.com",
        "password": "ForgeAdmin2026!"
    })
    token = auth_data["access_token"]
    print(f"✓ Login successful. Token received: {token[:15]}...")
    
    # 2. Validate Referral Code
    print("\n[Test 2] Validating referral code 'ARUN10'...")
    status, ref_data = make_request("/referrals/validate/ARUN10")
    assert ref_data["valid"] == True
    assert ref_data["discount_percentage"] == 10.0
    print("✓ Referral code validation passes.")

    # 3. Fetch Projects
    print("\n[Test 3] Fetching projects catalogue...")
    status, projects = make_request("/projects")
    assert len(projects) > 0
    project_slug = projects[0]["slug"]
    project_id = projects[0]["id"]
    print(f"✓ Catalog verified. Selected baseline: {projects[0]['title']} ({project_slug})")

    # 4. Submit Enquiry
    print("\n[Test 4] Submitting student enquiry...")
    status, enquiry = make_request("/enquiries", "POST", {
        "full_name": "Test Student",
        "email": "test@student.edu",
        "whatsapp_number": "+919876543210",
        "college_name": "Test University",
        "department": "CSE",
        "year": "4th Year",
        "project_id": project_slug,
        "preferred_technology": "Python, FastAPI",
        "budget_range": "₹5,000–₹10,000",
        "required_deadline": "2026-12-31",
        "deployment_required": True,
        "demo_video_required": True,
        "additional_requirements": "Custom reports page",
        "referral_code": "ARUN10",
        "message": "Enquiry request for AI Resume Analyzer"
      })
    enquiry_id = enquiry["id"]
    print(f"✓ Enquiry submitted. Generated ID: {enquiry_id}")

    # 5. Create Quotation
    print("\n[Test 5] Generating quotation for enquiry...")
    status, quote = make_request("/quotes", "POST", {
        "enquiry_id": enquiry_id,
        "base_price": 5999.0,
        "customization_cost": 500.0,
        "additional_feature_cost": 0.0,
        "deployment_cost": 999.0,
        "documentation_cost": 0.0,
        "other_charges": 0.0,
        "referral_discount": 700.0,
        "final_price": 6798.0,
        "advance_percentage": 40.0,
        "advance_amount": 2719.2,
        "remaining_amount": 4078.8,
        "estimated_delivery": "14 Days",
        "milestones": [
            {"name": "Advance Payment", "percentage": 40.0, "amount": 2719.2, "status": "Pending"},
            {"name": "Delivery Balance", "percentage": 60.0, "amount": 4078.8, "status": "Pending"}
        ],
        "scope_of_work": "- Core parsing engine\n- Next.js UI integration\n- Custom report downloads",
        "terms": "Advance non-refundable after scope locked."
    }, token)
    quote_id = quote["id"]
    print(f"✓ Quotation generated. Quote ID: {quote_id}. Final Price: ₹{quote['final_price']}")

    # 6. Student Accepts Quotation
    print("\n[Test 6] Student accepts quotation...")
    status, accepted_quote = make_request(f"/quotes/{quote_id}/accept", "POST")
    assert accepted_quote["status"] == "Accepted"
    print("✓ Quote accepted.")

    # 7. Verify Order Created & Status is Advance Pending
    order_id = f"PF-ORD-{quote_id.split('-')[-1]}"
    print(f"\n[Test 7] Fetching generated order status for {order_id}...")
    status, order = make_request(f"/orders/{order_id}")
    assert order["order_status"] == "Advance Pending"
    assert order["scope_status"] == "PENDING_LOCK"
    print("✓ Order initially generated in 'Advance Pending' and 'PENDING_LOCK' state.")

    # 8. Record Advance Payment -> Verify Scope LOCKED & Status Scope Locked
    print("\n[Test 8] Admin records advance payment...")
    status, order_after_pay = make_request(f"/orders/{order_id}/payment", "POST", {
        "amount": 2719.2,
        "phase": "Advance",
        "notes": "Logged cash advance payment"
    }, token)
    assert order_after_pay["advance_paid"] == True
    assert order_after_pay["scope_status"] == "LOCKED"
    assert order_after_pay["order_status"] == "Scope Locked"
    print("✓ Advance payment recorded. State successfully transitioned to LOCKED and Scope Locked.")

    # 9. Create Change Request -> Verify CR created
    print("\n[Test 9] Student requests a new feature (Change Request)...")
    status, order_after_cr = make_request(f"/orders/{order_id}/change-requests", "POST", {
        "description": "Add PDF download support",
        "reason": "Guide requested PDF deliverables",
        "priority": "High"
    })
    crs = order_after_cr["change_requests"]
    assert len(crs) > 0
    cr_id = crs[0]["id"]
    print(f"✓ Change Request logged. ID: {cr_id}. Status: {crs[0]['status']}")

    # 10. Admin Quotes Change Request -> Verify Quote Sent
    print("\n[Test 10] Admin quotes change request...")
    status, order_after_cr_quote = make_request(f"/orders/{order_id}/change-requests/{cr_id}", "PUT", {
        "status": "Quote Sent",
        "additional_cost": 1000.0,
        "additional_timeline": "3 Days"
      }, token)
    cr_quoted = next(c for c in order_after_cr_quote["change_requests"] if c["id"] == cr_id)
    assert cr_quoted["status"] == "Quote Sent"
    assert cr_quoted["additional_cost"] == 1000.0
    print(f"✓ Change request quoted at ₹{cr_quoted['additional_cost']} and status updated.")

    # 11. Student Accepts Change Request Quote -> Verify price increases & features updated
    print("\n[Test 11] Student accepts quoted change request...")
    status, order_final = make_request(f"/orders/{order_id}/change-requests/{cr_id}/accept", "POST")
    cr_final = next(c for c in order_final["change_requests"] if c["id"] == cr_id)
    assert cr_final["status"] == "Approved"
    assert order_final["price"] == order_after_pay["price"] + 1000.0
    assert any("[Change Request Add-On]" in f for f in order_final["features"])
    print(f"✓ Change request approved. Price increased from ₹{order_after_pay['price']} to ₹{order_final['price']}.")
    print("✓ Verified that [Change Request Add-On] was locked into the active features list.")

    print("\n==============================================")
    print("ALL API VERIFICATION TESTS COMPLETED SUCCESSFULLY!")
    print("==============================================")

if __name__ == "__main__":
    run_tests()
