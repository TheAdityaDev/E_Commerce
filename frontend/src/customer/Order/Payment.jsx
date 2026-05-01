import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { axiosInstance } from '../../config/api.config'
import { useAppSelector } from '../../Redux Toolkit/store'
import secureLocalStorage from 'react-secure-storage'

const loadScript = (src) =>
  new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve(true)
    script.onerror = () => reject(new Error('Failed to load ' + src))
    document.body.appendChild(script)
  })

const Payment = () => {
  const cart = useAppSelector((store) => store.cart);
  const couponState = useAppSelector((store) => store.coupon);
  const { user } = useAppSelector((state) => state.user) || {}
  const [status, setStatus] = useState('idle') // idle | processing | success | failure
  const [message, setMessage] = useState('')
  const params = useParams()
  const location = useLocation()

  const createOrder = async () => {
    // Call backend order creation which returns a Razorpay payment link when
    // `paymentGateway=razorpay` is provided. This route requires auth.
    const token = secureLocalStorage.getItem('token') || null
    const url = '/order?paymentGateway=razorpay'
    const res = await axiosInstance.post(
      url,
      { shippingAddress: user?.address || 'No address provided' },
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    )

    return res.data
  }

  const verifyPayment = async (payload) => {
    // Replace with your backend verification endpoint
    await axiosInstance.post('/payment/verify', payload)
  }

  // When Razorpay redirects to /payment/success/:orderId or /payment/failed/:orderId
  // it includes query params like `razorpay_payment_id` and `razorpay_order_id`.
  // Detect those and call the backend payment success handler to finalize the order.
  useEffect(() => {
    const path = location.pathname || ''
    const isSuccessRoute = path.includes('/payment/success')
    const isFailedRoute = path.includes('/payment/failed')

    if (!isSuccessRoute && !isFailedRoute) return

    const qs = new URLSearchParams(location.search)
    const paymentId = qs.get('razorpay_payment_id') || qs.get('paymentId')
    const paymentLinkId =
      qs.get('razorpay_payment_link_id') ||
      qs.get('payment_link_id') ||
      qs.get('paymentLinkId')
    const paymentOrderId = params.orderId

    if ((!paymentId || (!paymentLinkId && !paymentOrderId)) && isFailedRoute) {
      setStatus('failure')
      setMessage('Payment failed or information missing')
      return
    }

    const finalize = async () => {
      setStatus('processing')
      try {
        const token = secureLocalStorage.getItem('token') || null
        if (!paymentId) {
          setStatus('failure')
          setMessage('Missing payment id')
          return
        }

        const query = new URLSearchParams()
        if (paymentLinkId) query.set('paymentLinkId', paymentLinkId)
        if (paymentOrderId) query.set('paymentOrderId', paymentOrderId)

        const res = await axiosInstance.get(`/payment/${paymentId}?${query.toString()}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
        const data = res.data
        // backend returns message 'Payment successful' on success
        if (data && /success/i.test(data.message || '')) {
          setStatus('success')
        } else {
          setStatus('failure')
          setMessage(data.message || 'Payment failed')
        }
      } catch (err) {
        setStatus('failure')
        setMessage(err.message || 'Verification failed')
      }
    }

    finalize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search])

  const sendNotifications = async (payload) => {
    // Ask backend to send SMS / Email (optional)
    try {
      await axiosInstance.post('/api/notifications/send', {
        ...payload,
      })
    } catch (err) {
      console.error('Notification error', err)
    }
  }

  const openRazorpay = async () => {
    setStatus('processing')
    setMessage('')
    try {
      await loadScript('https://checkout.razorpay.com/v1/checkout.js')
      const order = await createOrder()

      // If backend returned a razorpay hosted payment link, open it in a new
      // window/tab. This is more robust on laptops where popups may be blocked.
      if (order.payment_link_url) {
        // open in a new tab/window — use target _blank so user can continue.
        window.open(order.payment_link_url, '_blank')
        setStatus('processing')
        return
      }

      // Otherwise, if backend returned a razorpay order id / details, use
      // the inline checkout as before.
      const options = {
        key: order.key || import.meta.env.REACT_APP_RAZORPAY_KEY || 'RAZORPAY_KEY',
        amount: order.amount || 0,
        currency: order.currency || 'INR',
        name: order.name || 'E-Commerce',
        description: order.description || 'Order Payment',
        order_id: order.orderId || order.id,
        discount: couponState.coupon?.discount || 0,
        handler: async function (response) {
          try {
            await verifyPayment(response)
            setStatus('success')
            await sendNotifications({ type: 'success', response })
          } catch (err) {
            setStatus('failure')
            setMessage('Verification failed')
          }
        },
        modal: {
          ondismiss: function () {
            if (status !== 'success') setStatus('idle')
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (resp) {
        setStatus('failure')
        setMessage(resp.error && resp.error.description ? resp.error.description : 'Payment failed')
        sendNotifications({ type: 'failure', resp })
      })
      rzp.open()
    } catch (err) {
      setStatus('failure')
      setMessage(err.message || 'Payment initiation failed')
    }
  }

  const reset = () => {
    setStatus('idle')
    setMessage('')
  }

  return (
    <div style={{ padding: 20, maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
      <h2>Complete Payment</h2>

      {status === 'idle' && (
        <div>
          <p>Click below to start payment.</p>
          <button onClick={openRazorpay} style={{ padding: '10px 18px', fontSize: 16, cursor: 'pointer' }}>
            Pay with Razorpay
          </button>
        </div>
      )}

      {status === 'processing' && (
        <div>
          <div className="spinner" aria-hidden style={{ margin: '18px auto' }}></div>
          <p>Opening payment window…</p>
          <p style={{ color: '#666' }}>If nothing opens, click below to open manually.</p>
          <button onClick={openRazorpay} style={{ padding: '8px 14px', fontSize: 14 }}>Open Razorpay</button>
        </div>
      )}

      {status === 'success' && (
        <div>
          <div className="anim success">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" className="circle" />
              <path className="check" d="M34 62 L52 80 L86 44" fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3>Payment Successful</h3>
          <p style={{ color: '#444' }}>Thank you! A receipt will be sent via SMS and email.</p>
          <div style={{ marginTop: 12 }}>
            <button onClick={reset} style={{ marginRight: 8, padding: '8px 12px' }}>Back</button>
          </div>
        </div>
      )}

      {status === 'failure' && (
        <div>
          <div className="anim failure">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" className="circle" />
              <g className="cross" strokeWidth="6" strokeLinecap="round">
                <path d="M40 40 L80 80" fill="none" />
                <path d="M80 40 L40 80" fill="none" />
              </g>
            </svg>
          </div>
          <h3>Payment Failed</h3>
          <p style={{ color: '#c00' }}>{message || 'Your payment did not complete.'}</p>
          <div style={{ marginTop: 12 }}>
            <button onClick={openRazorpay} style={{ marginRight: 8, padding: '8px 12px' }}>Retry Payment</button>
            <button onClick={reset} style={{ padding: '8px 12px' }}>Cancel</button>
          </div>
        </div>
      )}

      <style>{`\n        .spinner{ width:48px;height:48px;border-radius:50%;border:5px solid #eee;border-top-color:#1e88e5;animation:spin 1s linear infinite }\n        @keyframes spin{ to{ transform:rotate(360deg) } }\n        .anim{ width:120px;height:120px;margin:0 auto }\n        .anim svg{ width:100%;height:100% }\n        .anim .circle{ fill:none; stroke:#eee; stroke-width:6 }\n        .anim.success .circle{ stroke:#4caf50; stroke-dasharray: 314; stroke-dashoffset: 314; animation:drawCircle 0.6s forwards }\n        .anim.success .check{ stroke:#fff; stroke:#fff; stroke-dasharray: 120; stroke-dashoffset: 120; stroke:#fff; stroke-linecap:round; stroke-linejoin:round; animation:drawCheck 0.5s 0.6s forwards }\n        .anim.failure .circle{ stroke:#f8d7da; stroke-dasharray: 314; stroke-dashoffset: 314; animation:drawCircle 0.6s forwards }\n        .anim.failure .cross path{ stroke:#c62828; stroke-dasharray: 70; stroke-dashoffset: 70; animation:drawCross 0.45s 0.6s forwards }\n        @keyframes drawCircle{ to{ stroke-dashoffset: 0 } }\n        @keyframes drawCheck{ to{ stroke-dashoffset: 0 } }\n        @keyframes drawCross{ to{ stroke-dashoffset: 0 } }\n      `}</style>
    </div>
  )
}

export default Payment
